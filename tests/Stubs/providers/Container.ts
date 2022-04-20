import { Logger } from '@athenna/logger'

/*
|--------------------------------------------------------------------------
| Container contract
|--------------------------------------------------------------------------
|
| Here is where you can register the types of your container to facilitate
| the use of the container inside constructors
|
*/

export interface ContainerContract {
  logger: Logger
}

/*
|--------------------------------------------------------------------------
| Container
|--------------------------------------------------------------------------
|
| Here we define the container as the ContainerContract and any type. This
| way you can use providers that are not registered in ContainerContract too.
|
*/

export type Container = ContainerContract & any