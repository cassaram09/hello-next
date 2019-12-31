import Link from "next/link";

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
