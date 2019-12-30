import Link from "next/link";
import axios from "axios";

const Index = props => {
  console.log(props);
  return (
    <div>
      <Link href="/about">
        <a>About Page</a>
      </Link>
      <p>Hello Next.js</p>
    </div>
  );
};

Index.getInitialProps = async function() {
  const res = await axios.get("http://localhost:3000/api/content");

  return {
    content: res.data
  };
};

export default Index;
