import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'assets/*',
      'public/*',
    ],
    rules: {
      'node/prefer-global/process': 'off',
      'ts/no-invalid-this': 'off',
      'ts/no-this-alias': 'off',
      'no-console': 'off',
      'no-alert': 'off',
    },
  },
)