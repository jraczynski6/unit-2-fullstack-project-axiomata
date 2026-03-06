import HeaderWrapper from "./HeaderWrapper";
import FooterWrapper from "./FooterWrapper";
import "../assets/css/layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <HeaderWrapper />

      {/* Body: panel mount + main page */}
      <div className="layout-body">
        {/* Portal mount point for SectionPanel */}
        <div id="section-panel-root"></div>

        <main className="layout-main">
          {children}
        </main>
      </div>

      <FooterWrapper />
    </div>
  );
}