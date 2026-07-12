import { Map1, Routing, Tree } from "iconsax-react";

export default function LoungeShowcase() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto flex max-w-[1296px] gap-6">
        {/* Main showcase card */}
        <div className="relative flex-1 overflow-hidden rounded-3xl bg-photo-card-bg p-6">
          <h3 className="relative z-10 mb-4 text-2xl font-bold text-white">
            خدمات سی آی پی
          </h3>

          {/* Map/floorplan area */}
          <div className="relative h-[454px] w-full overflow-hidden rounded-t-[216.5px] bg-lounge-map-bg">
            {/* TODO: replace with exported lounge-map.png from Figma */}
            <div className="h-full w-full bg-gradient-to-br from-badge-bg to-transparent" />
          </div>

          {/* Decorative icon badges */}
          <div className="absolute right-6 top-24 flex h-10 w-10 items-center justify-center rounded-full bg-badge-bg">
            <Map1 size={20} color="white" variant="Linear" />
          </div>
          <div className="absolute right-4 top-40 flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <Routing size={18} color="#22223b" variant="Linear" />
          </div>
          <div className="absolute right-8 top-52 flex h-6 w-6 items-center justify-center rounded-full bg-accent">
            <Tree size={14} color="white" variant="Linear" />
          </div>
        </div>

        {/* Right side content area (empty in reference, reserved for future content) */}
        <div className="w-[400px]" />
      </div>
    </section>
  );
}
