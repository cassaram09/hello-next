import Link from "next/link";
import axios from "axios";

const Post = props => {
  return (
    <div>
      <Link href="/about">
        <a>About Page</a>
      </Link>
      <div>
        <p>{props.post.title}</p>
      </div>
    </div>
  );
};

Post.getInitialProps = async function(context) {
  const { id } = context.query;
  const res = await axios.get(`http://localhost:3000/api/posts/${id}`);

  return {
    post: res.data
  };
};

export default Post;
