import styled from 'styled-components';

// Common color palette
export const colors = {
  primary: '#2c3e50',
  secondary: '#34495e',
  accent: '#3498db',
  background: '#f5f6fa',
  cardBg: '#ffffff',
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    light: '#bdc3c7'
  },
  success: '#2ecc71',
  warning: '#f1c40f',
  danger: '#e74c3c',
  border: '#dcdde1'
};

// Common styled components
export const PageContainer = styled.div`
  background-color: ${colors.background};
  min-height: 100vh;
  padding: 2rem;
`;

export const Card = styled.div`
  background-color: ${colors.cardBg};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  color: ${colors.primary};
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

export const SubTitle = styled.h2`
  color: ${colors.secondary};
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

export const Button = styled.button`
  background-color: ${props => props.variant === 'danger' ? colors.danger : colors.accent};
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const FilterContainer = styled.div`
  background-color: ${colors.cardBg};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1.5px solid #999;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

export const Select = styled.select`
  padding: 12px;
  border: 1.5px solid #999;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

export const Textarea = styled.textarea`
  padding: 12px;
  border: 1.5px solid #999;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`; 