module.exports.parse = (bytes, change, keys = ['desktop', 'mobile', 'config'], types = ['js', 'css']) => {
  const manifest = JSON.parse(bytes)
  if (change)
    keys.forEach((key) => {
      types.forEach((type) => {
        if (manifest[key] && manifest[key][type] && Array.isArray(manifest[key][type])) {
          for (let i = manifest[key][type].length - 1; i >= 0; i -= 1) {
            const value = change(manifest[key][type][i], type)
            if (value !== undefined) {
              manifest[key][type][i] = value
            } else {
              manifest[key][type].splice(i, 1)
            }
          }
        }
      })
    })
  return manifest
}
