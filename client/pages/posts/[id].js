import Link from "next/link";
import axios from "axios";

const Index = props => {
  return (
    <div>
      <Link href="/about">
        <a>About Page</a>
      </Link>
      <div>
        {props.content.map(p => (
          <p>{p.title}</p>
        ))}
      </div>
    </div>
  );
};

Index.getInitialProps = async function() {
  const res = await axios.get("http://localhost:3000/api/content");

  console.log(res.data);

  return {
    content: res.data
  };
};

export default Index;
