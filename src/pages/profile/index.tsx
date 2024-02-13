import { collection, getDocs, orderBy, query, getDoc, doc, where, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { useEffect, useState } from "react";
import { Social } from "../../components/social";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";

interface LinkProps {
    id: string,
    name: string,
    URL: string,
    background: string,
    color: string
}

interface SocialProps {
    instagram: string,
    facebook: string,
    youtube: string
}

export function Profile() {

    const [links, setLinks] = useState<LinkProps[]>([])
    const [social, setSocial] = useState<SocialProps>()
    
    const { username } = useParams()
    const navigate = useNavigate()

    useEffect(() => {

      function checkUserExistence(docs: QuerySnapshot<DocumentData>) {
        if (docs.empty) {
          navigate("/404"); // Navegar para a página de erro 404 se não houver documentos
          return true; // Indica que o usuário não existe
        }
        return false; // Indica que o usuário existe
      }      

        function loadLinks() {
          if (username) {
            const linksRef = collection(db, 'links');
            const associationRef = collection(db, 'uidUsernameAssociations');
            const queryRef = query(associationRef, where("username", "==", username));
      
            getDocs(queryRef)
            .then((docs) => {
              
              if (checkUserExistence(docs)) {
                return;
              }
    
              const uid = docs.docs[0].id; // Obtem o uid do username
              const linksQuery = query(linksRef, where("uid", "==", uid), orderBy("created", "asc"));
                
              getDocs(linksQuery)
                .then((linksDocs) => {
                  let list = [] as LinkProps[];
      
                  linksDocs.forEach((item) => {
                    if (item.data() !== undefined) {
                      list.push({
                        id: item.id,
                        name: item.data().name,
                        URL: item.data().URL,
                        background: item.data().background,
                        color: item.data().color,
                      });
                    }
                  });
      
                  setLinks(list);
                  console.log("Links carregados com sucesso:", list);
                 })
                .catch((error) => {
                  console.error("Erro ao obter documentos:", error);
                });
            })
            .catch((error) => {
              console.error("Erro ao obter documentos:", error);
            });
        }
      }
    
        function loadSocial() {
          if (username) {
            const associationRef = collection(db, 'uidUsernameAssociations');
            const queryRef = query(associationRef, where("username", "==", username));
          
            getDocs(queryRef)
            .then((docs) => {
              if (checkUserExistence(docs)) {
                return;
              }
          
                const uid = docs.docs[0].id; // Obtem o uid do username
                const networksRef = doc(db, 'networks', uid);
          
                getDoc(networksRef)
                  .then((item) => {
                    if (item.exists()) {
                      setSocial({
                        instagram: item.data()?.instagram,
                        facebook: item.data()?.facebook,
                        youtube: item.data()?.youtube,
                      });
                    }
                  })
                  .catch((error) => {
                    console.error("Erro ao obter documentos:", error);
                  });
              })
              .catch((error) => {
                console.error("Erro ao obter documentos:", error);
              });
          }
        }
    
      loadLinks();
      loadSocial();
      }, [username, navigate]);

        // Verifica se o username é válido antes de renderizar o conteúdo
      if (!username) {
        return null;
      }

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h1 className="text-white md:text-4xl text-3xl font-bold mt-14">@{username}</h1>
            <h3 className="text-white mt-5 mb-5 font-bold"> Meus links: </h3>

            <main className="flex flex-col w-11/12 max-w-xl">
                {links.map((item) => (
                     <section 
                     key={item.id}
                     className="mb-5 py-2 rounded-xl select-none transition-transform hover:scale-105 cursor-pointer"
                     style={{backgroundColor: item.background}}
                     >
                         <a href={item.URL} target="_blank">
                             <p 
                             className="text-base md:text-lg text-center"
                             style={{color: item.color}}
                             >{item.name}</p>
                         </a>
                     </section>        
                ))}
               
            </main>

            {social && Object.keys(social).length > 0 && (
                 <footer className="flex justify-center gap-3 my-4">
                 <Social url={social?.facebook}>
                     <FaFacebook size={30} color="#FFF" className="hover:size-9 duration-300"/>
                 </Social>
 
                 <Social url={social?.instagram}>
                     <FaInstagram size={30} color="#FFF" className="hover:size-9 duration-300"/>
                 </Social>
                 
                 <Social url={social?.youtube}>
                     <FaYoutube size={30} color="#FFF" className="hover:size-9 duration-300"/>
                 </Social>
             </footer>
            )}

            <footer>

              <Link to='/'><h2 className="text-white hover:bg-yellow-500 hover:scale-110 duration-500 font-bold m-7 border border-yellow-500 py-3.5 px-6 rounded-3xl cursor-pointer">Crie Seu Perfil</h2></Link>

            </footer>

        </div>
    )
}