import { useNavigate } from 'react-router-dom';
import Button from './Button';

// This component is used everywhere , which a back button is needed and using the navgate(-1) will redirect the url one step back
function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type='back'
      onClick={e => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
