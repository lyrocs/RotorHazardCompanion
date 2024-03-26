export default function Table({ headers, body }) {
  const thead = headers.length ? (
    <thead className="bg-gray-300 text-dark">
      <tr>
        {headers.map((header, index) => (
          <th key={`theader-${index}`} className=" px-4 text-left h-8">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  ):  null
  const tbody = body.length ? (
    <tbody>
      {body.map((row, rowIndex) => (
        <tr key={`tbody-line-${rowIndex}`} className="border-b border-gray-500 h-8">
          {row.map((cell, cellIndex) => (
            <td key={`td-${rowIndex}-${cellIndex}`} className="pr-4 pl-2">- {cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  ) : null
  return (
    <table className="w-full">
      {thead}
      {tbody}
    </table>
  )
}
