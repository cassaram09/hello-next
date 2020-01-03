import Link from "next/link";
import styles from "../styles/styles.scss";
styles;
const Index = props => {
  return (
    <div>
      <Link href="/about">
        <a>About Page</a>
      </Link>
      <Link href="/posts">
        <a>Posts Page</a>
      </Link>
      <p>Hello Next.js</p>
    </div>
  );
};

export default Index;
