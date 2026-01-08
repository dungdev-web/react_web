import Link from "next/link";
import Image from "next/image";
export default function Banner() {
  return (
    <section className="awe-section-2">
      <div className="section section-banner">
        <div className="container1 mx-auto max-w-6xl">
          <div
            className="   grid grid-cols-1 md:grid-cols-2 gap-4
    max-w-6xl mx-auto
    md:w-screen"
          >
            <div className="col-md-6 col-sm-6 col-xs-12 hidden-xs !w-auto">
              <div className="box mg_mb mg_l_mb">
                <Link href="#" title="dualeo-food">
                  <Image
                    className="lazyload loaded"
                    src="//bizweb.dktcdn.net/100/310/257/themes/801944/assets/banner_box_1.jpg?1676001091788"
                    alt="alt"
                    data-ll-status="loaded"
                  />
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12 !w-auto">
              <div className="rows flex">
                <div className="col-md-6 col-xs-6">
                  <div className="box margin-bottom-15">
                    <Link href="#" title="dualeo-food">
                      <Image
                        className="lazyload loaded"
                        src="//bizweb.dktcdn.net/100/310/257/themes/801944/assets/banner_box_2.jpg?1676001091788"
                        alt="alt"
                        data-ll-status="loaded"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-xs-6">
                  <div className="box margin-bottom-15">
                    <Link href="#" title="dualeo-food">
                      <Image
                        className="lazyload loaded"
                        src="//bizweb.dktcdn.net/100/310/257/themes/801944/assets/banner_box_3.jpg?1676001091788"
                        alt="alt"
                        data-ll-status="loaded"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="box padding-top-15">
                <Link href="#" title="dualeo-food">
                  <Image
                    className="lazyload loaded"
                    src="//bizweb.dktcdn.net/100/310/257/themes/801944/assets/banner_box_4.jpg?1676001091788"
                    alt="alt"
                    data-ll-status="loaded"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
