import { Header_Wrap } from "@/styles/component/Header";

export default function Header() {
  return (
    <>
      <Header_Wrap>
        <nav className="nav_bar">
          <ul>
            <li>Todo</li>
            <li>Profile</li>
          </ul>
        </nav>
      </Header_Wrap>
    </>
  );
}
