import "./PageHero.css";

type Props = {
  title: string;
  subtitle?: string;
  backgroundImageUrl?: string;
  right?: React.ReactNode;
};

export default function PageHero({
  title,
  subtitle,
  backgroundImageUrl,
  right,
}: Props) {
  return (
    <header
      className="page-hero"
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `linear-gradient(
                rgba(0,0,0,.55),
                rgba(0,0,0,.55)
              ), url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <section className="page-hero__inner">
        <div className="page-hero__text">
          <h1 className="page-hero__title">{title}</h1>
          {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        </div>

        {right && <aside className="page-hero__right">{right}</aside>}
      </section>
    </header>
  );
}
