export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Smartling API Proxy</h1>
      <p className="mb-4">
        This is a simple proxy server for Smartling API requests. The main functionality is in the API route at <code>/api/proxy</code>.
      </p>
      <h2 className="text-xl font-bold mb-2">How to use:</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {`POST /api/proxy
Headers:
  x-url: [target Smartling API URL]
  authorization: [your auth token]
  content-type: application/json
  ...other Smartling API headers

Body: Your request payload`}
      </pre>
    </main>
  );
}
