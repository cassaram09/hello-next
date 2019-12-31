import Link from "next/link";
import axios from "axios";

const Index = props => {
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
  try {
    const res = await axios.get("http://localhost:3000/api/content");

    return {
      content: res.data
    };
  } catch (e) {
    console.log(e);
    return { content: [] };
  }
};

export default Index;
