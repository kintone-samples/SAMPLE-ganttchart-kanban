const forge = require('node-forge')
const constants = require('./constants')
// a hexString is considered negative if it's most significant bit is 1
// because serial numbers use ones' complement notation
// this RFC in section 4.1.2.2 requires serial numbers to be positive
// http://www.ietf.org/rfc/rfc5280.txt
const toPositiveHex = (hexString) => {
  let mostSiginficativeHexAsInt = parseInt(hexString[0], 16)
  if (mostSiginficativeHexAsInt < 8) {
    return hexString
  }

  mostSiginficativeHexAsInt -= 8
  return mostSiginficativeHexAsInt.toString() + hexString.substring(1)
}

const getAlgorithm = (key) => {
  switch (key) {
    case 'sha256':
      return forge.md.sha256.create()
    default:
      return forge.md.sha1.create()
  }
}

const locals = ['localhost', 'localhost.localdomain', '127.0.0.1']

module.exports.filter = (domain) =>
  domain &&
  domain.trim() !== '' &&
  !locals.includes(domain) &&
  (constants.VALID_IP.test(domain) || constants.VALID_DOMAIN.test(domain))

module.exports.generateCA = () => {
  return this.generate(
    [
      { name: 'commonName', value: constants.pkgName },
      // { name: 'countryName', value: 'CN' },
      // { name: 'organizationName', value: 'dev cert group' },
    ],
    {
      days: 7300,
      keySize: 2048,
      algorithm: 'sha256',
      extensions: [
        {
          name: 'basicConstraints',
          cA: true,
        },
      ],
    },
  )
}

module.exports.generateBy = (rootCA, domains) => {
  const attr = [
    { name: 'commonName', value: locals[0] },
    // { name: 'countryName', value: 'CN' },
    // { name: 'organizationName', value: 'Create Kintone App' },
  ]
  const altNames = domains
    .filter(this.filter)
    .concat(locals)
    .map((domain) => {
      return constants.VALID_IP.test(domain) ? { type: 7, ip: domain } : { type: 2, value: domain }
    })

  const options = {
    keySize: 2048,
    ca: rootCA,
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: false,
      },
      {
        name: 'keyUsage',
        keyCertSign: false, // Must be set to false or Chrome won't accept this certificate otherwise
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        timeStamping: true,
      },
      {
        name: 'subjectAltName',
        altNames,
      },
    ],
  }

  return this.generate(attr, options)
}

/**
 *
 * @param {forge.pki.CertificateField[]} attrs Attributes used for subject and issuer.
 * @param {object} options
 * @param {number} [options.days=365] the number of days before expiration
 * @param {number} [options.keySize=1024] the size for the private key in bits
 * @param {object} [options.extensions] additional extensions for the certificate
 * @param {string} [options.algorithm="sha1"] The signature algorithm sha256 or sha1
 * @param {boolean} [options.pkcs7=false] include PKCS#7 as part of the output
 * @param {boolean} [options.clientCertificate=false] generate client cert signed by the original key
 * @param {string} [options.clientCertificateCN="John Doe jdoe123"] client certificate's common name
 * @param {function} [done] Optional callback, if not provided the generation is synchronous
 * @returns
 */
module.exports.generate = (
  attrs = [
    {
      name: 'commonName',
      value: 'example.org',
    },
    {
      name: 'countryName',
      value: 'US',
    },
    {
      shortName: 'ST',
      value: 'Virginia',
    },
    {
      name: 'localityName',
      value: 'Blacksburg',
    },
    {
      name: 'organizationName',
      value: 'Test',
    },
    {
      shortName: 'OU',
      value: 'Test',
    },
  ],
  options = {},
) => {
  const keySize = options.keySize || 1024

  const keyPair = options.keyPair
    ? {
        privateKey: forge.pki.privateKeyFromPem(options.keyPair.privateKey),
        publicKey: forge.pki.publicKeyFromPem(options.keyPair.publicKey),
      }
    : forge.pki.rsa.generateKeyPair(keySize)

  const cert = forge.pki.createCertificate()

  cert.serialNumber = toPositiveHex(forge.util.bytesToHex(forge.random.getBytesSync(9))) // the serial number can be decimal or hex (if preceded by 0x)

  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + (options.days || 365))

  // add
  const caPrivateKey =
    options.ca && options.ca.private ? forge.pki.privateKeyFromPem(options.ca.private) : keyPair.privateKey
  const caCert = options.ca && options.ca.cert ? forge.pki.certificateFromPem(options.ca.cert) : cert
  const issuerAttrs = options.ca ? caCert.subject.attributes : attrs

  cert.setSubject(attrs)
  // cert.setIssuer(attrs)
  cert.setIssuer(issuerAttrs)

  cert.publicKey = keyPair.publicKey

  cert.setExtensions(
    options.extensions || [
      {
        name: 'basicConstraints',
        cA: true,
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 6, // URI
            value: 'http://example.org/webid#me',
          },
        ],
      },
    ],
  )

  // cert.sign(keyPair.privateKey, getAlgorithm(options && options.algorithm))
  cert.sign(caPrivateKey, getAlgorithm(options && options.algorithm))

  const fingerprint = forge.md.sha1
    .create()
    .update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes())
    .digest()
    .toHex()
    .match(/.{2}/g)
    .join(':')

  const pem = {
    private: forge.pki.privateKeyToPem(keyPair.privateKey),
    public: forge.pki.publicKeyToPem(keyPair.publicKey),
    cert: forge.pki.certificateToPem(cert),
    fingerprint,
  }

  if (options.pkcs7) {
    const p7 = forge.pkcs7.createSignedData()
    p7.addCertificate(cert)
    pem.pkcs7 = forge.pkcs7.messageToPem(p7)
  }

  if (options.clientCertificate) {
    const clientkeys = forge.pki.rsa.generateKeyPair(1024)
    const clientcert = forge.pki.createCertificate()
    clientcert.serialNumber = toPositiveHex(forge.util.bytesToHex(forge.random.getBytesSync(9)))
    clientcert.validity.notBefore = new Date()
    clientcert.validity.notAfter = new Date()
    clientcert.validity.notAfter.setFullYear(clientcert.validity.notBefore.getFullYear() + 1)

    const clientAttrs = JSON.parse(JSON.stringify(attrs))

    for (let i = 0; i < clientAttrs.length; i += 1) {
      if (clientAttrs[i].name === 'commonName') {
        if (options.clientCertificateCN) clientAttrs[i] = { name: 'commonName', value: options.clientCertificateCN }
        else clientAttrs[i] = { name: 'commonName', value: constants.name }
      }
    }

    clientcert.setSubject(clientAttrs)

    // Set the issuer to the parent key
    clientcert.setIssuer(attrs)

    clientcert.publicKey = clientkeys.publicKey

    // Sign client cert with root cert
    clientcert.sign(keyPair.privateKey)

    pem.clientprivate = forge.pki.privateKeyToPem(clientkeys.privateKey)
    pem.clientpublic = forge.pki.publicKeyToPem(clientkeys.publicKey)
    pem.clientcert = forge.pki.certificateToPem(clientcert)

    if (options.pkcs7) {
      const clientp7 = forge.pkcs7.createSignedData()
      clientp7.addCertificate(clientcert)
      pem.clientpkcs7 = forge.pkcs7.messageToPem(clientp7)
    }
  }

  const caStore = forge.pki.createCaStore()
  // caStore.addCertificate(cert)
  caStore.addCertificate(caCert)

  try {
    forge.pki.verifyCertificateChain(caStore, [cert], (vfd) => {
      if (vfd !== true) {
        throw new Error('Certificate could not be verified.')
      }
      return true
    })
  } catch (ex) {
    throw new Error(ex)
  }

  return pem
}
