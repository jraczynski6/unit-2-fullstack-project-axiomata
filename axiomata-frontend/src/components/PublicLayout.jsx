import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}