var myObject = {
    get a(){
        return this._a_;
    },
    //setter
    set a(val){
        this._a_ = val * 2;
    }
};
myObject.a = 2;
myObject.a; //4