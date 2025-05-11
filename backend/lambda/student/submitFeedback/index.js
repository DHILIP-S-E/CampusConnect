exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    const name = data.name;
    const feedback = data.feedback;
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Thank you, " + name }),
    };
  };
  