export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Format date to local date-time string
};

export const readableTimeFormat = (timestamp) => {
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);
  
    const readableDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    return readableDate
  };