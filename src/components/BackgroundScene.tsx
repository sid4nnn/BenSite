import backgroundAvif1280 from '../../assets/sundownnew-1280.avif';
import backgroundAvif1646 from '../../assets/sundownnew-1646.avif';
import backgroundWebp1280 from '../../assets/sundownnew-1280.webp';
import backgroundWebp1646 from '../../assets/sundownnew-1646.webp';

type BackgroundSceneProps = {
  onReady?: () => void;
};

export function BackgroundScene({ onReady }: BackgroundSceneProps) {
  return (
    <div className="background-scene">
      <picture>
        <source
          type="image/avif"
          srcSet={`${backgroundAvif1280} 1280w, ${backgroundAvif1646} 1646w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${backgroundWebp1280} 1280w, ${backgroundWebp1646} 1646w`}
          sizes="100vw"
        />
        <img
          className="background-photo"
          src={backgroundWebp1646}
          srcSet={`${backgroundWebp1280} 1280w, ${backgroundWebp1646} 1646w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          onLoad={onReady}
          onError={onReady}
        />
      </picture>
    </div>
  );
}
