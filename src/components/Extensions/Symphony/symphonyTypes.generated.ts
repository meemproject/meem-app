/* eslint-disable no-new */
/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
export namespace API {
	export interface IError {
		status: string
		code: string
		reason: string
		friendlyReason: string
	}

	export enum HttpMethod {
		Get = 'GET',
		Post = 'POST',
		Patch = 'PATCH',
		Put = 'PUT',
		Options = 'OPTIONS',
		Delete = 'DELETE'
	}

	export interface IApiResponseBody {
		apiVersion: string
	}

	/** The source of the event. Who emits the event. */
	export enum EventSource {
		Server = 'server',
		Client = 'client'
	}

	export interface IEvent {
		key: string
		data?: Record<string, any>
	}

	export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
		T extends (...args: any) => Promise<infer R> ? R : any

	export interface IRequestPaginated {
		/** The current page to fetch. Page starts at 0 index */
		page?: number

		/** The number of records to fetch */
		limit?: number
	}

	export enum PublishAction {
		Tweet = 'tweet'
	}

	// export enum RequirementType {
	// 	SumOfAllEmojis = 'sumOfAllEmojis'
	// }

	// export enum RequirementGroupType {
	// 	And = 'and',
	// 	Or = 'or'
	// }

	// export interface IRequirement {
	// 	roleIds?: string[] | null
	// 	type: RequirementType
	// 	emojis: string[]
	// 	threshold: number
	// 	not?: boolean
	// }

	// export interface IRequirementGroup {
	// 	type: RequirementGroupType
	// 	requirements: IRequirement[]
	// }

	// export interface IRule {
	// 	ruleId?: string
	// 	channelIds?: string[] | null
	// 	action: StewardAction
	// 	requirements: IRequirementGroup[]
	// 	isEnabled: boolean
	// }

	// export interface IStewardSettings {
	// 	rules: IRule[]
	// }

	export enum PublishType {
		Proposal = 'proposal',
		PublishImmediately = 'publishImmediately'
	}

	export interface IRule {
		action: PublishAction
		publishType: PublishType
		proposerRoles: string[]
		proposerEmojis: string[]
		approverRoles: string[]
		approverEmojis: string[]
		vetoerRoles: string[]
		vetoerEmojis: string[]
		proposalChannels: string[]
		proposalShareChannel: string
		canVeto: boolean
		votes: number
		vetoVotes: number
		proposeVotes: number
		shouldReply: boolean
		ruleId: string
		isEnabled: boolean
	}

	export interface IRuleToSave extends Omit<IRule, 'ruleId'> {
		ruleId?: string
	}

	export interface ISavedRule
		extends Omit<
			IRule,
			| 'proposerRoles'
			| 'proposerEmojis'
			| 'approverRoles'
			| 'approverEmojis'
			| 'vetoerRoles'
			| 'vetoerEmojis'
			| 'proposalChannels'
		> {
		proposerRoles: string
		proposerEmojis: string
		approverRoles: string
		approverEmojis: string
		vetoerRoles: string
		vetoerEmojis: string
		proposalChannels: string
	}

	export interface IDiscordRole {
		id: string
		name: string
		managed: boolean
		color: number
		icon: string | null
	}

	export interface IDiscordChannel {
		id: string
		name: string
		canSend: boolean
		canView: boolean
	}

	export interface IEventDefinition {
		/** The subscription key */
		key: string

		/** The event name to emit */
		// @ts-ignore
		eventName: SocketEvent

		/** The event data */
		data: Record<string, any>
	}

	export interface IEmitOptions<
		TDefinition extends IEventDefinition = IEventDefinition
	> {
		key: IEventDefinition['key']
		eventName: IEventDefinition['eventName']
		data: IEventDefinition['data']
	}

	export namespace v1 {
		/** Get Config */
		export namespace GetConfig {
			export interface IPathParams {}

			export const path = () => '/api/1.0/config'

			export const method = HttpMethod.Get

			export interface IQueryParams {}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace GetDiscordChannels {
			export interface IPathParams {}

			export const path = () => '/api/1.0/discord/channels'

			export const method = HttpMethod.Get

			export interface IQueryParams {
				agreementId: string
				jwt: string
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				channels: IDiscordChannel[]
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace GetDiscordEmojis {
			export interface IPathParams {}

			export const path = () => '/api/1.0/discord/emojis'

			export const method = HttpMethod.Get

			export interface IQueryParams {
				agreementId: string
				jwt: string
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				emojis: {
					id: string
					name: string
				}[]
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace GetDiscordRoles {
			export interface IPathParams {}

			export const path = () => '/api/1.0/discord/roles'

			export const method = HttpMethod.Get

			export interface IQueryParams {
				agreementId: string
				jwt: string
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				roles: IDiscordRole[]
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace GetTwitterAuthUrl {
			export interface IPathParams {}

			export const path = () => '/api/1.0/twitter/auth'

			export const method = HttpMethod.Get

			export interface IQueryParams {
				/** The agreement id to associate the twitter account with */
				agreementId: string

				/** The jwt to authenticate the user with */
				jwt: string

				/** The url to return the user to after authentication */
				returnUrl: string
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				/** The url to authenticate with twitter */
				authUrl: string
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace InviteDiscordBot {
			export interface IPathParams {}

			export const path = () => '/api/1.0/discord/inviteBot'

			export const method = HttpMethod.Get

			export interface IQueryParams {
				agreementId: string
				jwt: string
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				/** The url to invite the bot to your discord */
				inviteUrl: string

				/** The code to activate the bot using /activateSteward command */
				code: string
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace RemoveRules {
			export interface IPathParams {}

			export const path = () => '/api/1.0/removeRules'

			export const method = HttpMethod.Post

			export interface IQueryParams {}

			export interface IRequestBody {
				agreementId: string
				jwt: string
				ruleIds: string[]
			}

			export interface IResponseBody extends IApiResponseBody {
				status: 'success'
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace SaveRules {
			export interface IPathParams {}

			export const path = () => '/api/1.0/saveRules'

			export const method = HttpMethod.Post

			export interface IQueryParams {}

			export interface IRequestBody {
				agreementId: string
				jwt: string
				rules: IRuleToSave[]
			}

			export interface IResponseBody extends IApiResponseBody {
				status: 'success'
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		export namespace TwitterAuthCallback {
			export interface IPathParams {}

			export const path = () => '/api/1.0/twitter/callback'

			export const method = HttpMethod.Get

			export interface IQueryParams {
				/** The code to exchange for an access token */
				code: string
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				status: 'success'
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}
	}
	export enum SocketEvent {
		Err = 'err',
		EventHandlerError = 'eventHandlerError',
		Subscribe = 'subscribe',
		SubscribeAck = 'subscribeAck',
		Test = 'test',
		Unsubscribe = 'unsubscribe',
		UnubscribeAck = 'unubscribeAck'
	}
	export namespace Events {
		export namespace Err {
			export const eventName = SocketEvent.Err

			export const eventSource = EventSource.Server

			export interface ISubscribePayload {}

			export interface IEventPayload extends Record<string, any> {}
		}

		export namespace EventHandlerError {
			export const eventName = SocketEvent.EventHandlerError

			export const eventSource = EventSource.Server

			export interface ISubscribePayload {}

			export interface IEventPayload extends Record<string, any> {}
		}

		export namespace Subscribe {
			export const eventName = SocketEvent.Subscribe

			export const eventSource = EventSource.Client

			export interface IEventPayload {
				// @ts-ignore
				type: Event.Subscribe
				events: {
					key: string
					data?: Record<string, any>
				}[]
			}
		}

		export namespace SubscribeAck {
			export const eventName = SocketEvent.SubscribeAck

			export const eventSource = EventSource.Server

			export interface ISubscribePayload {}

			export interface IEventPayload {
				// @ts-ignore
				events: SubscribeType[]
			}
		}

		export namespace Test {
			export const eventName = SocketEvent.Test

			export const eventSource = EventSource.Client

			export interface ISubscribePayload {}

			export interface IEventPayload {
				// @ts-ignore
				type: Event.Test
				data: Record<string, any>
			}
		}

		export namespace Unsubscribe {
			export const eventName = SocketEvent.Unsubscribe

			export const eventSource = EventSource.Client

			export interface IEventPayload {
				// @ts-ignore
				type: Event.Unsubscribe
				// @ts-ignore
				events: SubscribeType[]
			}
		}

		export namespace UnubscribeAck {
			export const eventName = SocketEvent.UnubscribeAck

			export const eventSource = EventSource.Server

			export interface ISubscribePayload {}

			export interface IEventPayload {
				// @ts-ignore
				events: SubscribeType[]
			}
		}
	}

	export type SubscribeType =
		| (Events.Err.ISubscribePayload & { type: SocketEvent.Err })
		| (Events.EventHandlerError.ISubscribePayload & {
				type: SocketEvent.EventHandlerError
		  })
		| (Events.SubscribeAck.ISubscribePayload & {
				type: SocketEvent.SubscribeAck
		  })
		| (Events.Test.ISubscribePayload & { type: SocketEvent.Test })
		| (Events.UnubscribeAck.ISubscribePayload & {
				type: SocketEvent.UnubscribeAck
		  })

	export type EventListener =
		| {
				eventName: SocketEvent.Err
				handler: (options: { detail: Events.Err.IEventPayload }) => void
		  }
		| {
				eventName: SocketEvent.EventHandlerError
				handler: (options: {
					detail: Events.EventHandlerError.IEventPayload
				}) => void
		  }
		| {
				eventName: SocketEvent.SubscribeAck
				handler: (options: {
					detail: Events.SubscribeAck.IEventPayload
				}) => void
		  }
		| {
				eventName: SocketEvent.Test
				handler: (options: {
					detail: Events.Test.IEventPayload
				}) => void
		  }
		| {
				eventName: SocketEvent.UnubscribeAck
				handler: (options: {
					detail: Events.UnubscribeAck.IEventPayload
				}) => void
		  }
}
