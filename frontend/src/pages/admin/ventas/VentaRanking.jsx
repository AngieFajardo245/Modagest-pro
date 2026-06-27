import React from "react";


export default function VentaRanking({
  rankingProductos = [],
  styles
}) {


  return (

    <div style={styles.rankingCard}>


      <h3 style={styles.rankingTitle}>
        🏆 Productos más vendidos
      </h3>



      {
        rankingProductos.length === 0 ? (


          <p style={styles.rankingEmpty}>
            No hay productos vendidos todavía
          </p>


        ) : (


          rankingProductos.map(
            ([nombre, cantidad], index) => (


              <div
                key={`${nombre}-${index}`}
                style={styles.rankingItem}
              >


                <div>

                  <span>
                    {index === 0 && "🥇 "}
                    {index === 1 && "🥈 "}
                    {index === 2 && "🥉 "}

                    #{index + 1} {nombre}

                  </span>


                </div>


                <strong>

                  {cantidad} vendidos

                </strong>


              </div>


            )
          )


        )
      }


    </div>

  );

}