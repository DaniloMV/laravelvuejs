Vue.http.headers.common['X-CSRF-TOKEN'] = $("#token").attr("value");

new Vue({
  el :'#manage-vue',
  data :{
    items: [],
    pagination: {
      total: 0,
      per_page: 2,
      from: 1,
      to: 0,
      current_page: 1
    },
    offset: 4,
    formErrors:{},
    formErrorsUpdate:{},
    newItem : {'title':'','description':'', 'showns':true},
    fillItem : {'title':'','description':'','id':'','showns':''},
    search : ''
  },
  computed: {
    isActived: function() {
      return this.pagination.current_page;
    },
    pagesNumber: function() {
      if (!this.pagination.to) {
        return [];
      }
      var from = this.pagination.current_page - this.offset;
      if (from < 1) {
        from = 1;
      }
      var to = from + (this.offset * 2);
      if (to >= this.pagination.last_page) {
        to = this.pagination.last_page;
      }
      var pagesArray = [];
      while (from <= to) {
        pagesArray.push(from);
        from++;
      }
      return pagesArray;
    },

  },
  ready: function() {
    this.getVueItems(this.pagination.current_page);
  },
  created:function() {
    this.searchVueItems();
  },
  methods: {
    clickCheckBox:function(item) {
      if(item.showns == 0){
        item.showns=1;
      }
      else{
        item.showns=0;
      }
      console.log(item.showns);
      this.fillItem.title = item.title;
      this.fillItem.id = item.id;
      this.fillItem.description = item.description;
      this.fillItem.showns=item.showns;
      var input = this.fillItem;
      this.$http.put('/api/vueitems/'+item.id,input).then((response) => {
        this.newItem = {'title':'','description':'','id':''};
        this.changePage(this.pagination.current_page);
        toastr.success('Item Updated Successfully.', 'Success Alert', {timeOut: 3000});
      }, (response) => {
        this.formErrors = response.data;
      });
    },

    searchVueItems: function() {
      this.$http.get('/api/vueitems/search?search='+this.search).then((response) => {
        this.$set('items', response.data.data.data);
        this.$set('pagination', response.data.pagination);
      });
    },
    getVueItems: function(page) {
      this.$http.get('/api/vueitems?page='+page).then((response) => {
        this.$set('items', response.data.data.data);
        this.$set('pagination', response.data.pagination);
      });
    },
    createItem: function() {
      console.log(this.newItem);
      var input = this.newItem;
      this.$http.post('/api/vueitems',input).then((response) => {
        this.changePage(this.pagination.current_page);
        this.newItem = {'title':'','description':''};
        $("#create-item").modal('hide');
        toastr.success('Post Created Successfully.', 'Success Alert', {timeOut: 3000});
      }, (response) => {
        this.formErrors = response.data;
      });
    },
    deleteItem: function(item) {
      var ini=this;
      swal({
              title: "Are you sure?",
              text: "You will not be able to recover this imaginary file!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },
            function(isConfirm){
              if(isConfirm){
                ini.$http.delete('/api/vueitems/'+item.id).then((response) => {
                  ini.changePage(ini.pagination.current_page);
                });
                swal("Deleted!", "Your imaginary file has been deleted.", "success");
              }
              
      });    
    },
    editItem: function(item) {
      this.fillItem.title = item.title;
      this.fillItem.id = item.id;
      this.fillItem.description = item.description;
      $("#edit-item").modal('show');
    },
    updateItem: function(id) {
      var input = this.fillItem;
      this.$http.put('/api/vueitems/'+id,input).then((response) => {
        this.changePage(this.pagination.current_page);
        this.newItem = {'title':'','description':'','id':''};
        $("#edit-item").modal('hide');
        toastr.success('Item Updated Successfully.', 'Success Alert', {timeOut: 3000});
      }, (response) => {
        this.formErrors = response.data;
      });
    },
    changePage: function(page) {
      this.pagination.current_page = page;
      this.getVueItems(page);
    }
  }
});