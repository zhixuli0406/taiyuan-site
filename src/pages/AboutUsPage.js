import { MapPin, Phone, Mail, Clock, Package, ShieldCheck, Users } from "lucide-react"
import { useState, useEffect } from 'react';
import { getStoreSettings } from '../api/storeSettings'; // Import the API function

const AboutUsPage = () => {
  const [storeSettings, setStoreSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        // Replace fetch with the imported API function
        const data = await getStoreSettings();
        // Remove the manual response.ok check as Axios handles non-2xx errors
        /*
        const response = await fetch('/api/store-settings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        */
        setStoreSettings(data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch store settings:", e);
        setError("無法載入商店資訊，請稍後再試。");
        setStoreSettings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreSettings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">關於我們</h1>
      {/* Company Introduction */}
      <section className="mb-16">
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">我們的故事</h2>
            {loading && <p>載入中...</p>}
            {error && <p className="text-red-500">無法載入商店故事。</p>}
            {storeSettings && !loading && !error && (
              <p className="text-gray-700 mb-4">
                {storeSettings.description || '商店描述未提供'}
              </p>
            )}
          </div>
        </div>
      </section>
      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">我們的價值觀</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div
              className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">品質至上</h3>
            <p className="text-gray-600">我們嚴格篩選每一件商品，確保只提供最高品質的產品給我們的客戶。</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div
              className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">客戶至上</h3>
            <p className="text-gray-600">我們以客戶為中心，致力於提供卓越的購物體驗和優質的客戶服務。</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div
              className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">誠信經營</h3>
            <p className="text-gray-600">我們以誠信和透明度為基礎，建立與客戶、供應商和合作夥伴的長期關係。</p>
          </div>
        </div>
      </section>
      {/* Contact Information */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">聯絡我們</h2>

        {/* Change grid to two columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left card: Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">聯絡資訊</h3>

            {loading && <p>載入中...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {storeSettings && !loading && !error && (
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">地址</h4>
                    {(storeSettings && storeSettings.address) ? (() => {
                      const addressParts = [
                        storeSettings.address.postalCode,
                        storeSettings.address.city,
                        storeSettings.address.district,
                        storeSettings.address.addressLine
                      ].filter(Boolean);

                      const displayAddress = addressParts.length > 0 ? addressParts.join(' ') : '未提供';

                      return <p className="text-gray-600">{displayAddress}</p>;
                    })() : (
                      <p className="text-gray-600">未提供</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">電話</h4>
                    <p className="text-gray-600">{storeSettings.contact?.phone || '未提供'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">電子郵件</h4>
                    <p className="text-gray-600">{storeSettings.contact?.email || '未提供'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">營業時間</h4>
                    {storeSettings && storeSettings.businessHours ? (
                       <p className="text-gray-600">
                         {storeSettings.businessHours}
                       </p>
                    ) : (
                      <p className="text-gray-600">未提供</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right card: Social Media Links */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">社群軟體</h3>
            {storeSettings && storeSettings.socialLinks && (
              Object.values(storeSettings.socialLinks).some(link => link) ? (
                <div className="space-y-4">
                  {storeSettings.socialLinks.facebook && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      <a href={storeSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Facebook
                      </a>
                    </div>
                  )}
                  {storeSettings.socialLinks.instagram && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.172.053 1.771.22 2.258.41a3.977 3.977 0 0 1 1.453.892 3.977 3.977 0 0 1 .892 1.453c.19.487.357 1.086.41 2.258.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.053 1.172-.22 1.771-.41 2.258a3.977 3.977 0 0 1-.892 1.453 3.977 3.977 0 0 1-1.453.892c-.487.19-1.086.357-2.258.41-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.172-.053-1.771-.22-2.258-.41a3.977 3.977 0 0 1-1.453-.892 3.977 3.977 0 0 1-.892-1.453c-.19-.487-.357-1.086-.41-2.258-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.053-1.172.22-1.771.41-2.258A3.977 3.977 0 0 1 3.8 3.518a3.977 3.977 0 0 1 1.453-.892c.487-.19 1.086-.357 2.258-.41C8.416 2.175 8.796 2.163 12 2.163m0-2.163c-3.259 0-3.667.014-4.947.072-1.28.058-2.177.237-2.953.547a6.14 6.14 0 0 0-2.177 1.385 6.14 6.14 0 0 0-1.385 2.177c-.31.776-.49 1.673-.547 2.953-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.28.237 2.177.547 2.953a6.14 6.14 0 0 0 1.385 2.177 6.14 6.14 0 0 0 2.177 1.385c.776.31 1.673.49 2.953.547 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.28-.058 2.177-.237 2.953-.547a6.14 6.14 0 0 0 2.177-1.385 6.14 6.14 0 0 0 1.385-2.177c.31-.776.49-1.673.547-2.953.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.28-.237-2.177-.547-2.953a6.14 6.14 0 0 0-1.385-2.177 6.14 6.14 0 0 0-2.177-1.385c-.776-.31-1.673-.49-2.953-.547C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z"/></svg>
                      <a href={storeSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Instagram
                      </a>
                    </div>
                  )}
                  {storeSettings.socialLinks.line && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.383 12.421c.28.157.447.466.447.803v.004c0 .336-.167.645-.447.802l-5.37 3.009c-.56.314-1.257-.077-1.257-.727V9.135c0-.65.697-1.04 1.257-.727l5.37 3.013zm7.252-6.271c.096.622.05 1.265-.14 1.873-.19.608-.523 1.177-.98 1.678l-.002.002c-.457.501-1.028.907-1.678.98-.608.19-1.251.236-1.873.14-.622-.097-1.205-.337-1.715-.702-.51-.364-.925-.84-1.208-1.39a3.977 3.977 0 0 1-.478-1.703c-.02-.64.13-1.27.437-1.822.306-.552.75-1.006 1.288-1.312.538-.306 1.14-.448 1.748-.411.608.037 1.2.244 1.715.598.515.354.94.83 1.235 1.378.294.547.44 1.153.435 1.764zm-6.573 4.89c-.187.1-.327.268-.39.47-.064.202-.048.416.048.613.096.197.27.354.484.44.214.085.447.096.67.031.222-.064.416-.197.555-.377.14-.18.214-.4.208-.622-.006-.222-.09-.436-.23-.613-.14-.178-.327-.31-.538-.377-.21-.069-.435-.069-.648-.006zM16.47 17.53c.608.19 1.251.236 1.873.14.622-.097 1.205-.337 1.715-.702.51-.364.925-.84 1.208-1.39.283-.55.478-1.163.478-1.806 0-.643-.15-1.284-.437-1.86-.287-.576-.71-1.086-1.235-1.48-.525-.393-1.12-.65-1.715-.73-.6-.08-1.19.02-1.748.287-.558.268-1.04.685-1.386 1.2-.346.515-.537 1.11-.544 1.728-.006.618.14 1.225.435 1.764.294.54.71 1.016 1.208 1.39.483.365 1.016.605 1.588.702z"/></svg>
                      <a href={storeSettings.socialLinks.line} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Line
                      </a>
                    </div>
                  )}
                  {storeSettings.socialLinks.x && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <a href={storeSettings.socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        X (Twitter)
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">目前尚未提供社群媒體連結</p>
              )
            )}
          </div>
        </div>
      </section>
      {/* Map */}
      <section>
        <div className="bg-gray-200 h-96 rounded-lg">
          {storeSettings && storeSettings.address ? (
            <iframe
              className="w-full h-full rounded-lg"
              frameBorder="0"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                `${storeSettings.address.addressLine}, ${storeSettings.address.district}, ${storeSettings.address.city}, ${storeSettings.address.country}`
              )}`}
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">無法載入地圖</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage
