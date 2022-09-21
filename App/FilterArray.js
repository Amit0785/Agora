  const data1 = [
    {
      id: 1,
      title: 'Product 3',
  
      image: 'https://source.unsplash.com/1024x768/?nature',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      id: 2,
      title: 'Product 2',
    
      image: 'https://source.unsplash.com/1024x768/?water',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1',
    },
    {
      id: 3,
      title: 'Product 1',
  
      image: 'https://source.unsplash.com/1024x768/?tree',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      id: 4,
      title: 'Product 2',
    
      image: 'https://source.unsplash.com/1024x768/?air',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
    {
      id: 5,
      title: 'Product 3',
    
      image: 'https://source.unsplash.com/1024x768/?fire',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
    {
      id: 6,
      title: 'Product 1',
     
      image: 'https://source.unsplash.com/1024x768/?earth',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
    {
      id: 7,
      title: 'Product 3',
  
      image: 'https://source.unsplash.com/1024x768/?girl',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
    {
      id: 3,
      title: 'Product 2',
   
      image: 'https://source.unsplash.com/1024x768/?tree',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      id: 3,
      title: 'Product 1',
 
      image: 'https://source.unsplash.com/1024x768/?tree',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
  ];

let data=[]
function arrayData(){
  
  for(var i=0;i<data1.length;i++){
    let temp=[]
    for(var j=0;j<data1.length;j++){

        if(data1[i].title == data1[j].title){
            temp.push(data1[j].image)
            
        }
       
    }   
    var temp1=data1[i]
    temp1.images=temp
    data.push(temp1)
    
  }

  data = data.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t.title === value.title
  ))
)

 console.log("data===>",data);
  
}

  arrayData()