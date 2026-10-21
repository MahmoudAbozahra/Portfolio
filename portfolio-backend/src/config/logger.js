const redact = (value) => {
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => (
    /password|token|secret|authorization|cookie/i.test(key) ? [key, '[REDACTED]'] : [key, item]
  )));
};

module.exports = {
  info: (message, meta) => console.info(message, meta ? redact(meta) : ''),
  warn: (message, meta) => console.warn(message, meta ? redact(meta) : ''),
  error(message, error) {
    console.error(message, { name: error?.name, message: error?.message, code: error?.code });
  }
};
