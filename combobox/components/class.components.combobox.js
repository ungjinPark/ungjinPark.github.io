class CustomSelect extends HTMLElement{
    constructor(){
        super();
        this.value;
        this.focusedValue = null;
        this.selectedIndex = -1;
        this.focusedOption = -1;
        this.selectedElement = null;
        this.itemsCountToDisplay=3;
    }
    __setEmbeddedElement__ ( root = this ) {
        //A Setting Statement about the butotn for interection with combobox
        root.controller = document.createElement('button');
        root.controller.setAttribute('role','combobox');
        root.prepend(root.controller);
        //A Setting Statement about the Listbox to show options to users.
        const Listbox = this.querySelectorAll('ul');
        if(Listbox.length===1){
            root.listbox=Listbox[0];
            root.listbox.setAttribute('role','listbox');
        }else if( Listbox.length < 1){
            return console.error(new Error('Need one unordered Listbox (ul) element. Please set it to a child of select-box.'));
        }else if( Listbox.length > 1 ){
            return console.error(new Error('Need only one unordered Listbox (ul) element. Please remove it all leave one.'));
        }
        /* new SimpleBar(root.listbox,{scrollbarMinSize:5,scrollbarMaxSize:0}) */
        //A Setting Statement for the item elements that users will be able to browse a list and choose values.
        const optionItems = this.listbox.querySelectorAll('li');
        if(optionItems.length>0){
            root.optionItems = optionItems;
            for ( var i=0; i<root.optionItems.length; i++){
                root.optionItems[i].setAttribute('role','option');
            }
        }else if( Listbox.length < 1){
            return console.error(new Error('Need one or more list items (li) element. Please set them to a child of ul (Listbox).'));
        }

        if(root.hasAttribute('size') && Number(root.getAttribute('size')) <= root.optionItems.length ){
            root.itemsCountToDisplay = Number(root.getAttribute('size'));
        }
    };

    get isExpanded (){
        const hasExpanded = this.controller.hasAttribute('aria-expanded')
        if(hasExpanded){
            return this.controller.getAttribute('aria-expanded') === 'true' ? true : false;
        }
    }

    set setDisplayList(val){
        if(val){
            this.controller.setAttribute('aria-expanded',true);
            this.listbox.classList.add('expanded')
            this.listbox.classList.remove('collapsed');
        }else{
            this.controller.setAttribute('aria-expanded',false);
            this.listbox.classList.add('collapsed');
            this.listbox.classList.remove('expanded');
        }
    }

    set setOptionExploreFocus (val) {
        const opt = this.optionItems;
        if(typeof val === 'number'){
            this.focusedOption = val;
            if( val < opt.length){
                for(var i=0; i<opt.length; i++){
                    if(val===i){
                        opt[val].id=this.id+'_focused';
                        opt[val].classList.add('focused');
                        this.focusedValue=opt[val].innerText;
                        this.controller.innerHTML=this.focusedValue;
                    }else{
                        opt[i].id='';
                        opt[i].classList.remove('focused');
                    }
                }
            }
        }else{
            console.error(new Error('Selected a first option temporary because Error occurred, Please Follow below and modify an error. the wrong type of data value requested to the setSelect property. The requested value type is '+val+'.'));
        }
    }
    set setSelect (val){
        const opt = this.optionItems;
        if(typeof val === 'number'){
            this.selectedIndex=val;
            if( val > -1 && val < opt.length ){
                for(var i=0; i<opt.length; i++){
                    if(opt[i] === opt[val]){
                        this.selectedElement=opt[val];
                        this.setOptionExploreFocus=val;
                        this.value=opt[val].innerText;
                    }
                }
            }
        }else{
            console.error(new Error('Selected a first option temporary because Error occurred, Please Follow below and modify an error. the wrong type of data value requested to the setSelect property. The requested value type is '+val+'.'));
        }
    }
    connectedCallback(root = this){
        //A Setting Statement about the identity of Combobox, My Combobox Component must have a unique identity. if not, temporary unique identify that distinguishable by consecutive numbers will be added to each select-box component automatically.
        this.__setEmbeddedElement__();
        root.TempIdentifyName = 'NVisions_UJ_ComboBox_TEMP';
        root.TempIdentifyIndex = Array.prototype.indexOf.call(document.querySelectorAll('select-box:not(.NVisions_UJ_ComboBox)'),this)+1;
        if(this.id===''){
            root.id = root.TempIdentifyName+root.TempIdentifyIndex;
            root.classList.add('auto-temp-id')
        }else{
            root.classList.add('NVisions_UJ_ComboBox')
        }
        root.controller.id= root.id+'_controller';
        root.controller.setAttribute('aria-controls',root.id+'_listbox');
        root.listbox.id=root.id+'_listbox';
    
        

        //Events
        const label = document.querySelector('label[for='+root.controller.id+']');
        if(label){
            label.id=this.id+'_label';
            root.controller.setAttribute('aria-labelledby',this.id+'_label '+this.id+'_focused')
            label.addEventListener('click',function(){
                root.controller.focus();
                toggleDisplayListHandler();
            })
        }
        this.controller.addEventListener('keydown',keyboardSelectHandler);
        this.controller.addEventListener('keydown',function(e){
            if(e.key === 'Enter'){toggleDisplayListHandler()}
            if(!root.isExpanded){
                if( e.altKey==true && e.code === 'ArrowDown'){
                    toggleDisplayListHandler()
                }
                if(e.code === 'ArrowUp' && root.selectedIndex > 0){
                    root.setSelect = (root.selectedIndex-1);
                    root.controller.innerHTML=root.selectedElement.innerHTML;
                }
                if(e.code === 'ArrowDown' && !e.altKey && root.selectedIndex < root.optionItems.length-1 ){
                    root.setSelect = (root.selectedIndex+1);
                    root.controller.innerHTML=root.selectedElement.innerHTML;
                }
            }

            if(root.isExpanded){
            
                if( e.altKey && e.code === 'ArrowUp' ){
                    toggleDisplayListHandler()
                }
            }
        });
        this.addEventListener('focusout',function(){
            if(root.isExpanded){
                toggleDisplayListHandler();
            }
        })
        this.listbox.addEventListener('contextmenu',function(e){
            e.preventDefault();
        })

        this.controller.addEventListener('mousedown',function(e){
            if(e.button !== 0 ){
                return false;
            }else{
                toggleDisplayListHandler()
            }
        });
        const opt = this.optionItems
        for(let i=0; i<opt.length; i++){
            (function(c){
                opt[c].addEventListener('mousedown',function(e){
                    if( e.button !== 0 ){
                        return false;
                    }else{
                        const opt_idx=Array.prototype.indexOf.call(opt[c].parentElement.children,opt[c]);
                        root.setSelect=opt_idx;
                        toggleDisplayListHandler();
                    }
                })

                opt[c].addEventListener('mouseover',function(e){
                    const opt_idx=Array.prototype.indexOf.call(opt[c].parentElement.children,opt[c]);
                    root.setOptionExploreFocus=opt_idx;
                })

                window.addEventListener('mousedown',function(e){
                    if(!root.contains(e.target)){
                        if( root.isExpanded ){
                            toggleDisplayListHandler();
                            root.setSelected=root.selectedIndex;
                            root.setOptionExploreFocus=root.selectedIndex;
                        }
                    }
                })
            })(i);
        }

        function toggleDisplayListHandler(){
            if(root.isExpanded){
                root.listbox.style.maxHeight='';
                root.controller.setAttribute('aria-activedescendant','');
                root.setDisplayList=false;
            }else if(!root.isExpanded){
                setTimeout(function(){
                    root.setDisplayList=true;
                },10)
                root.listbox.style.maxHeight=(root.optionItems[0].offsetHeight * root.itemsCountToDisplay)+'px';
                root.controller.setAttribute('aria-activedescendant',root.id+'_focused');
                root.optionItems[root.focusedOption].scrollIntoView();
            }
        }

        function keyboardSelectHandler (e){
            const [PREV,NEXT,ENTER,ESC,Space]=['ArrowUp','ArrowDown','Enter','Escape','Space'];
            
            let focusedElement;
            let focusedIndex;
            if( root.focusedOption !== -1 ){
                focusedElement = root.optionItems[root.focusedOption];
                focusedIndex=getIndexFromParent(focusedElement.parentNode.children,focusedElement);
            }

            if(root.isExpanded){
                if(e.code === PREV && !e.altKey){
                   select_previousOption();
                }
                if(e.code === NEXT && !e.altKey){
                    select_nextOption()
                }

                if(e.code === ENTER && !e.altKey){
                    root.setSelect=root.focusedOption;
                }

                if(e.code === Space){
                    e.preventDefault();
                }

                if(e.code === ESC){
                    toggleDisplayListHandler();
                }
            }
        }

        
        function select_nextOption(){
            const opt=root.optionItems;
            if(root.focusedOption<opt.length-1){
                root.setOptionExploreFocus = root.focusedOption+1;
                if(opt[root.focusedOption].getBoundingClientRect().bottom > root.listbox.getBoundingClientRect().bottom+3){
                    opt[root.focusedOption].scrollIntoView();
                }
            }
        }
        
        function select_previousOption(){
            if(root.focusedOption > 0){
                root.setOptionExploreFocus = root.focusedOption-1;
                opt[root.focusedOption].scrollIntoView();
            }
        }
        root.setSelect = 0;
        root.setDisplayList=false;
    }
}

function getIndexFromParent(Arr,El){
    return Array.prototype.indexOf.call(Arr,El);
}

customElements.define('select-box',CustomSelect);