import Link from "next/link";
import axios from "axios";

const Posts = props => {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/about">
        <a>About Page</a>
      </Link>
      <div>
        <div>
          {props.posts.map(p => (
            <Link href={`/posts/${p.id}`}>
              <a>{[p.title]}</a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

Posts.getInitialProps = async function(context) {
  const res = await axios.get(`http://localhost:3000/api/posts`);

  return {
    posts: res.data
  };
};

export default Posts;
