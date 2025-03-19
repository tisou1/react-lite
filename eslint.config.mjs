// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': [1, { allow: ['warn', 'error'] }],
  },
})
