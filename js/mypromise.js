var PENDING = "pending";
var RESOLVED = "resolved";
var REJECTED = "rejected";

var Promise = (function (){
	function Promise(fn){
		this.state = PENDING;
		this.doneList = [];
		this.failList = [];
		this.fn = fn;
		this.fn(this.resolve.bind(this), this.reject.bind(this))
	}

	var p = {
		done: function (cb){
			if(typeof cb == "function")
				this.doneList.push(cb)
			return this;
		},
		fail: function(cb){
			if(typeof cb == "function")
				this.failList.push(cb);
			return this;
		},
		then: function(success, fail){
			this.done(success || noop).fail(fail || noop)
			return this;
		},
		always: function(cb){
			this.done(cb).fail(cb)
			return this;
		},
		resolve: function(){
			this.state = RESOLVED;
			var lists = this.doneList;
			for(var i = 0, len = lists.length; i<len; i++){
				lists[0].apply(this, arguments);
				lists.shift();
			}
			return this;
		},
		reject: function(){
			this.state = REJECTED;
			var lists = this.failList;
			for(var i = 0, len = lists.length; i<len; i++){
				lists[0].apply(this, arguments);
				lists.shift();
			}
			return this;
		}
	}
	for(var k in p){
		Promise.prototype[k] = p[k]
	}

	return Promise;
})();

function noop(){}



/*

state: 当前执行状态，有pending、resolved、rejected 3种取值
done: cb
fail: errorcb
then: cb errocb
always: cb errorcb
resolve: 将状态更改为resolved,并触发绑定的所有成功的回调函数
reject: 将状态更改为rejected,并触发绑定的所有失败的回调函数

 */