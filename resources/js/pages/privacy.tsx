import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
    return (
        <>
            <Head title="Política de Privacidad" />

            <div className="px-6 pb-10 pt-6">
                <Link href="/register" className="text-brand-accent-brown mb-4 inline-flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Link>

                <h1 className="text-brand-green text-2xl font-bold">Política de Privacidad</h1>
                <p className="text-brand-muted-text mt-1 text-sm">Última actualización: febrero 2026</p>

                <div className="text-brand-muted-text mt-6 flex flex-col gap-6 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">1. Información que Recopilamos</h2>
                        <p>
                            Recopilamos información que usted nos proporciona directamente al registrarse y utilizar nuestra plataforma, incluyendo:
                            nombre del negocio, RFC, correo electrónico, número de teléfono y direcciones de envío.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">2. Uso de la Información</h2>
                        <p>
                            Utilizamos su información para: procesar y gestionar sus pedidos, comunicarnos con usted sobre su cuenta y pedidos,
                            mejorar nuestros servicios, y cumplir con obligaciones legales y fiscales aplicables en México.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">3. Protección de Datos</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no
                            autorizado, alteración, divulgación o destrucción. Sus datos de pago son procesados de forma segura a través de
                            proveedores certificados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">4. Compartir Información</h2>
                        <p>
                            No vendemos ni compartimos su información personal con terceros, excepto cuando sea necesario para: procesar sus pedidos
                            (proveedores de envío y pago), cumplir con requerimientos legales, o proteger nuestros derechos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">5. Derechos ARCO</h2>
                        <p>
                            De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, usted tiene derecho a
                            Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos
                            derechos, contáctenos a través de los canales disponibles en la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">6. Cookies</h2>
                        <p>
                            Utilizamos cookies y tecnologías similares para mantener su sesión activa y mejorar su experiencia en la plataforma. Puede
                            configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">7. Retención de Datos</h2>
                        <p>
                            Conservamos su información personal durante el tiempo que su cuenta esté activa o según sea necesario para cumplir con
                            nuestras obligaciones legales y fiscales. Puede solicitar la eliminación de su cuenta en cualquier momento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">8. Cambios a esta Política</h2>
                        <p>
                            Nos reservamos el derecho de actualizar esta política de privacidad. Le notificaremos sobre cambios significativos a
                            través de la plataforma o por correo electrónico. El uso continuado de nuestros servicios después de los cambios
                            constituye su aceptación.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">9. Contacto</h2>
                        <p>
                            Si tiene preguntas o inquietudes sobre nuestra política de privacidad o el tratamiento de sus datos personales, puede
                            contactarnos a través de los canales de atención disponibles en la plataforma.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}
