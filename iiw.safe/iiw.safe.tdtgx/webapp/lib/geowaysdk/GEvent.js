/**
*  @author xll
*  @date 20150917
*  Geoway自定义事件监听分发
*/
Geoway.GEvent = {
	/**
	 * @property {Array} listeners 
	 * 
	 * 所有的监听
	 */
    listeners: [],
	/**
	 * @method addListener
	 * 添加监听
	 * See also the {@link #on} shorthand.
	 * @param {string} name  
	 * 监听的事件名
	 * @param  {Function} closure
	 * 监听的事件方法
	 */
    addListener: function( name, closure ) {
        this.removeListener( name, closure );

        this.listeners.push( { name: name, closure: closure } );
    },
	/**
	 * @method removeListener
	 * 移除监听
	 *  See also the {@link #off} shorthand.
	 * @param  {String} name
	 * 监听的事件名
	 * @param  {Function} [closure]
	 * 监听的事件方法，如果没有这个参数就移除该事件名下的所有方法
	 */
    removeListener: function( name, closure ) {
        var listener;
        var i = 0;
        var length = this.listeners.length;
		if(closure){
            for (; i < length; i++ ) {
                listener = this.listeners[ i ];

                if ( listener.name === name && listener.closure === closure ) {
                    this.listeners.splice( i, 1 );
                    i--;
                    length--;
                }
            }
		}else{
			this.removeListenerFor(name);
		}
    },
	/**
	 * @method dispatch
	 * 监听事件的触发器
	 *  See also the {@link #trigger} shorthand.
	 * @param  {String} name 监听的事件名
	 * @param  {String/Object} [event] 事件方法需要的参数
	 */
    dispatch: function( name, event ) {
        var listener;
        var i = 0;
        var length = this.listeners.length;

        for (; i < length; i++ ) {
            listener = this.listeners[ i ];

            if ( !listener ) continue;

            if ( listener.name === name ) {
                listener.closure.call( this, event );
            }
        }
    },
	
    hasListenerFor: function( name ) {
        var listener;
        var i = 0;
        var length = this.listeners.length;

        for (; i < length; i++ )
            if ( this.listeners[ i ].name === name ) return true;

        return false;
    },

    hasListeners: function() {
        return this.listeners.length > 0;
    },

    removeAllListeners: function() {
        this.listeners = [];
    },

    removeListenerFor: function( name ) {
        var listener;
        var i = 0;
        var length = this.listeners.length;

        for (; i < length; i++ ) {
            listener = this.listeners[ i ];

            if ( listener.name === name ) {
                this.listeners.splice( i, 1 );
                i--;
                length--;
            }
        }
    },
    /**
     * @method on
     * @inheritdoc #addListener
     * Shorthand alias for {@link #addListener}
     */
    
    on:function(name, closure){
    	this.addListener(name, closure);
    },
    /**
     * @inheritdoc #removeListener
     *  Shorthand alias for {@link #removeListener}
     */        
    off:function(name, closure){
    	var argslen = arguments.length;
    	if(argslen==0){
    		this.removeAllListeners();
    	}else if(argslen==1){
    		this.removeListenerFor(arguments[0])
    	}else if(argslen>=2){
    		this.removeListener(arguments[0],arguments[1])
    	}
    },
    /**
     * @inheritdoc #dispatch
     *Shorthand alias for {@link #dispatch}
     */         
    trigger:function(name, event){
    	this.dispatch(name, event);
    }
}