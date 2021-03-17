exports.toMilliseconds = (time, from) => {
  switch (from) {
    case 'seconds':
      return time * 1000;
    case 'minutes':
      return time * 60 * 1000;
    case 'hours':
      return time * 60 * 60 * 1000;
    case 'days':
      return time * 24 * 60 * 60 * 1000;
    case 'years':
      return time * 365.25 * 24 * 60 * 60 * 1000;
    default:
      throw Error('Time conversion function is missing parameters');
  }
};

exports.fromMilliseconds = (time, to) => {
  switch (to) {
    case 'seconds':
      return time / 1000;
    case 'minutes':
      return time / 60 / 1000;
    case 'hours':
      return time / 60 / 60 / 1000;
    case 'days':
      return time / 24 / 60 / 60 / 1000;
    case 'years':
      return time / 365.25 / 24 / 60 / 60 / 1000;
    default:
      throw Error('Time conversion function is missing parameters');
  }
};
