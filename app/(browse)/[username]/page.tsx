interface UserPageProps {
  params: {
    userName: string;
  };
}
const UserPage = ({}: UserPageProps) => {
  return <div>User page</div>;
};

export default UserPage;
