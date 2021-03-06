/**
 * Intercom Browser module for Angular
 */
export class IntercomBrowser {
	app_id: string;

	init (data, onLoad?, onError?) {
		if (data.app_id) {
			this.app_id = data.app_id;
		}
		let w = (<any> window);
		// Intercom initialization
		w.intercomSettings = data;
		if (w.Intercom === undefined){
			w.Intercom = {
				q: [
					['boot', data],
				],
			};
			this.loader(onLoad, onError);
		} else {
			this.boot(data);
		}
	}

	sendCmd (cmd: string, data?: any) {
		let w = (<any> window);
		// Delay sending requests until Intercom is initialized
		if (w.Intercom === undefined) {
			console.error('ERROR Intercom may be blocked');
		} else if (typeof w.Intercom === 'function') {
			w.Intercom(cmd, data);
		} else {
			w.Intercom.q.push([cmd, data]);
		}
	}
	boot (data) {
		this.sendCmd('boot', data);
	}
	update (data) {
		this.sendCmd('update', data);
	}
	shutdown () {
		this.sendCmd('shutdown');
	}
	showNewMessage (msg?: string) {
		this.sendCmd('showNewMessage', msg);
	}
	trackEvent (name: string, data?: any) {
		let w = (<any> window);
		// Event tracking takes 3 arguments, so we split this out
		// into a new function instead of just calling sendCmd
		if (w.Intercom === undefined) {
			console.error('ERROR Intercom may be blocked');
		} else if (typeof w.Intercom === 'function') {
			w.Intercom('trackEvent', name, data);
		} else {
			w.Intercom.q.push(['trackEvent', name, data]);
		}
	}

	loader (onLoad?, onError?) {
		let s = document.createElement('script');
		s.type='text/javascript';
		s.async=true;
		s.src=`https://widget.intercom.io/widget/${this.app_id}`;
		if (onLoad) {
			s.onload = onLoad;
		}
		if (onError) {
			s.onerror = onError;
		}
		let x = document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(s,x);
	}
}
