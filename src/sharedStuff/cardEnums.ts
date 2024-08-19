export enum Colors {
  Red = 'red',
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
  Blank = 'Blank'
}


export interface CardProps {
  color: Colors; // Make required if every card needs a color
  number: number;
  owner?: string;
  onClick?: () => void;
  highlighted?: boolean;
  positionX: number
  positionY: number
}
