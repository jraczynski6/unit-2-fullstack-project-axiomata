import HeaderWrapper from "./HeaderWrapper";
import FooterWrapper from "./FooterWrapper";

export default function Layout({ children }) {
  return (
    <div>
      <HeaderWrapper />
      <main>{children}</main>
      <FooterWrapper />
    </div>
  );
}