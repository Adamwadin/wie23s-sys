import { useEffect, useState } from "react";
import "./App.css";
import { Socket, io } from "socket.io-client";
import { Product } from "./models/Product";

function App() {
  const [socket, setSocket] = useState<Socket>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [userName, setUserName] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [bidDate, setBidDate] = useState<String>("");

  useEffect(() => {
    if (socket) return;

    const s = io("http://localhost:3000");

    s.on("product_list", (products: Product[]) => {
      setProducts(products);
    });

    s.on("bid_accepted", (product: Product) => {
      setSelectedProduct(product);
    });

    setSocket(s);
  }, [setSocket, socket]);

  // const handleClick = () => {
  //   const bid: Bid = {
  //     amount: 100,
  //     productId: "abc123",
  //   };
  //   // Använd callback för att få svar från servern
  //   socket?.emit("make_bid", bid, (b: Bid) => {
  //     console.log("Acctepted bid: ", b);
  //   });
  // };

  const handleClick = (id: string) => {
    socket?.emit("join_room", id, (product: Product) => {
      console.log("Joined room: ", product);
      setSelectedProduct(product);
    });
  };

  const setDate = () => {
    const date = new Date();
    const localdate = date.toLocaleString();
    setBidDate(localdate);
    console.log(localdate);
  };

  const makeBid = () => {
    setDate();
    socket?.emit("make_bid", {
      amount: currentBid,
      productId: selectedProduct?.id,
      bidder: userName,
      bidtime: bidDate,
    });
  };
  const highestbid = selectedProduct?.bids.reduce((prev, current) =>
    prev.amount > current.amount ? prev : current
  );

  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => {
            handleClick(product.id);
          }}
        >
          {product.name}
        </div>
      ))}

      {selectedProduct && (
        <>
          <input className="input"
            type="text"
            value={userName}
            placeholder="Ange ditt namn"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            className="input"
            type="text"
            value={currentBid}
            onChange={(e) => setCurrentBid(Number(e.target.value))}
          />
          <button
            onClick={() => {
              if (
                selectedProduct &&
                currentBid > highestbid?.amount &&
                selectedProduct.price
              ) {
                makeBid();
                
              } else {
                alert("Du måste lägga ett högre bud");
              }
            }}
          >
            Lägg bud
          </button>
          <section>
            <div>
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.price}:- Minsta accepterade pris</p>
              <ul>
                {selectedProduct.bids
                  .sort((a, b) => b.amount - a.amount)
                  .map((bid, i) => (
                    <li key={i}>
                      {bid.amount} - {bid.bidder} - {bid.bidtime}
                    </li>
                  ))}
              </ul>
            </div>
          </section>
          <div>
            <h3>Highest bid</h3>
            <p>
              {" "}
              {highestbid?.bidder} - {highestbid?.amount}{" "}
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default App;
