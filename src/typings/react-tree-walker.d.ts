declare module "react-tree-walker" {
	interface ReactTreeWalkerOptions {
		componentWillUnmount?: boolean
	}
	
	interface ReactComponentInstance extends React.Component<any, any> {
		[key: string]: any
	}
	
	type ReactOrPreactComponent = ReactComponentInstance
	type ReactOrPreactAny = React.ReactElement<any> | ReactOrPreactComponent
	
	function reactTreeWalker(
		tree: ReactOrPreactAny,
		visitor: (
			element: React.ReactElement<any>,
			instance: ReactComponentInstance | undefined,
			context: object,
			childContext: object | undefined
		) => false | Promise<(undefined | false)>,
		context?: object,
		options?: ReactTreeWalkerOptions
	): Promise<undefined>

	export = reactTreeWalker
}