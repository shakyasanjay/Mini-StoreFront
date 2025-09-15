import { NavLink } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[600px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://www.freepik.com/free-photo/t-shirt-with-pants-and-shoes-on-wooden-background_12345678.htm")',
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <span className="text-sm tracking-widest mb-2">FALL 2025</span>
        <h1 className="text-5xl font-bold mb-4">New Arrivals</h1>
        <p className="text-lg mb-6 max-w-xl">
          Discover the latest deliveries from visvim, ssstein, Diemme and more.
        </p>
        <NavLink
          to="/products"
          className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
        >
          SHOP NOW
        </NavLink>
      </div>
    </section>
  );
};

export default HeroBanner;
