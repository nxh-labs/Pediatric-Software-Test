import { EventContext } from "domain-eventrix/react";
import { logger } from './utils/logger';
import { useContext } from "react";
import { usePediatricApp } from "../adapter";

const Button = (props: { hello: string }) => {
  const eventBus = useContext(EventContext)
  const unitService = usePediatricApp().unitService
  logger.log('EventBus state:', eventBus);
  logger.log("UnitService", unitService)
  
  if(eventBus.eventBus === null) return null
  return <h2>Hello {props.hello} </h2>;
};
export default Button;
