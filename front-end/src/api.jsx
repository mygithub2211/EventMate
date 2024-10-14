const apiUrl = "https://event-mate-server.vercel.app";

export async function fetchData(endpoint) {
  const response = await fetch(`${apiUrl}/${endpoint}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

export default apiUrl;