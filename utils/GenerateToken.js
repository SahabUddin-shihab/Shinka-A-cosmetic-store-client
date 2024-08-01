import jwt from 'jsonwebtoken';

const generateToken = ({ id, role }) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  return token;
};
export default generateToken;
