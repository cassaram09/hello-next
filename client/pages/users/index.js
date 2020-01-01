import Link from "next/link";
import axios from "axios";

const Users = props => {
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
          {props.users.map(u => (
            <Link href={`/users/${u.id}`}>
              <a>
                {u.firstName} {u.lastName} {u.password}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

Users.getInitialProps = async function(context) {
  const res = await axios.get(`http://localhost:3000/api/users`);

  return {
    users: res.data
  };
};

export default Users;
