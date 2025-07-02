import logo from '../assets/logo.svg';

export default function SplashScreen() {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex justify-center items-center">
      <div className="absolute w-[30vw] h-[80vh] overflow-hidden shadow shadow-neutral-200 flex flex-col justify-between">

        {/* Top container with justify-end */}
        <div className="flex justify-end">
          <div className="w-[200px] h-[250px] bg-transparent opacity-40 blur-3xl" />
        </div>

        {/* Bottom container with justify-start */}
        <div className="flex justify-start">
          <div className="w-[200px] h-[250px] bg-transparent opacity-40 blur-3xl" />
        </div>
      </div>

      {/* Logo wrapper with hover animation */}
      <div className="absolute z-10 w-[30vw] h-[80vh] flex justify-center items-center">
        <div className="w-70 h-70 bg-neutral-400/10 backdrop-blur-md rounded-full backdrop-saturate-100 backdrop-contrast-100 flex justify-center items-center shadow-lg shadow-neutral-400/20
          transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:backdrop-blur-lg">

          <div className="w-60 h-60 bg-transparent rounded-full flex justify-center items-center">
            <img src={logo} alt="Logo" className="w-50 h-50 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}