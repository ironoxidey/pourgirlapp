export const pullDomainFrom = (url: string): string => {
  try {
    let theURL = new URL(url);
    //console.log('theURL.hostname: ' + theURL.hostname);
    let domain = theURL.hostname.split(".");
    let linkName = domain.slice(-(domain.length === 4 ? 3 : 2))[0];
    //console.log(linkName);

    if (domain) {
      return linkName;
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
};
