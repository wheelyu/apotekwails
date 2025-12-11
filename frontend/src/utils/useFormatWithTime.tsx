const useFormatWithTime = (utcTime: Date) => {
    return new Date(utcTime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
  });
    };

export default useFormatWithTime;