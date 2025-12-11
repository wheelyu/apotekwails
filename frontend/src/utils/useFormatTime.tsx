const formatTime = (utcTime: Date) => {
    return new Date(utcTime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
  });
    };

export default formatTime;