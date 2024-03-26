export default function Pilot(name, channel) {
  return (
    <div className="col-span-6 md:col-span-3">
      <div className="card radius-15">
        <div className="card-body text-center">
          <div className="flex flex-col md:flex-col  items-center md:flex-row p-4 border radius-15">
            {/* <img src="avatar-default.jpg" width="100" className="rounded-circle shadow" alt="" /> */}
            <p className="mb-0 mb-10 text-3xl text-clip overflow-hidden w-full">{name}</p>
            <p className="mb-0 mt-5 channel">R{channel}</p>
            {/* <div className="d-grid"> <a href="#" className="btn btn-light radius-15">R{channel}</a>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
